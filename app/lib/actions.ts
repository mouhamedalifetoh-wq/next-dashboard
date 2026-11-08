'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { notFound, redirect, unstable_rethrow } from 'next/navigation';
import postgres from 'postgres';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Not part of the course's chapter 11 text: Server Actions are public POST
// endpoints, so proxy.ts (chapter 14) is not enough on its own. Every action
// checks the session itself, once, before doing anything else. This project has a
// single authenticated-user level, so "signed in" is the whole check.
async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
}

// Chapter 13: the schema now carries user-facing messages. Beyond the course it
// is still stricter than the course version (UUID ids, a finite amount of at least
// one cent and no more than fits the INT column once converted to cents; the
// upper bound also rejects Infinity).
const FormSchema = z.object({
  id: z.string().uuid(),
  customerId: z
    .string({ invalid_type_error: 'Please select a customer.' })
    .uuid({ message: 'Please select a customer.' }),
  amount: z.coerce
    .number({ invalid_type_error: 'Please enter a valid amount.' })
    .min(0.01, { message: 'Please enter an amount of at least $0.01.' })
    .max(21_474_836, { message: 'Please enter a smaller amount.' }),
  status: z.enum(['pending', 'paid'], {
    errorMap: () => ({ message: 'Please select an invoice status.' }),
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Chapter 13: what a form action returns to useActionState. Validation problems
// come back as field errors; database problems come back as one generic message.
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Chapter 12. Logs a database failure safely and gives the caller a generic,
// user-safe message to show. Only the error's type and code are logged, never its
// message, query or parameters (those can contain host names or user input).
// unstable_rethrow first: if the thrown value is one of Next.js's own control-flow
// errors (redirect(), notFound()), it is re-thrown untouched instead of being
// turned into a "Database Error". The try blocks below only wrap SQL, so this is
// a second line of defence.
function databaseMessage(action: string, error: unknown): string {
  unstable_rethrow(error);
  const { name, code } = (error ?? {}) as { name?: string; code?: string };
  console.error(`Database Error (${action}): ${name ?? 'unknown'} ${code ?? ''}`);
  return `Database Error: Failed to ${action}.`;
}

// The invoices table has no foreign key, so check the customer exists ourselves.
async function customerExists(customerId: string) {
  const rows = await sql`SELECT 1 FROM customers WHERE id = ${customerId}`;
  return rows.length > 0;
}

export async function createInvoice(
  prevState: State,
  formData: FormData,
): Promise<State> {
  await requireUser();

  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  // Math.round: 19.99 * 100 is 1998.9999999999998 in floating point, which
  // Postgres rejects for an INT column.
  const amountInCents = Math.round(amount * 100);
  const date = new Date().toISOString().split('T')[0];

  let customerFound = false;
  try {
    customerFound = await customerExists(customerId);
    if (customerFound) {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    }
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return { message: databaseMessage('Create Invoice', error) };
  }
  if (!customerFound) {
    return {
      errors: { customerId: ['Please select a customer.'] },
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // redirect() works by throwing, so it must stay outside the try/catch above.
  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard'); // not in the course: the overview page is statically cached in production
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  await requireUser();

  const invoiceId = FormSchema.shape.id.parse(id);

  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100);

  let customerFound = false;
  let invoiceFound = false;
  try {
    customerFound = await customerExists(customerId);
    if (customerFound) {
      const result = await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${invoiceId}
      `;
      invoiceFound = result.count > 0;
    }
  } catch (error) {
    return { message: databaseMessage('Update Invoice', error) };
  }
  if (!customerFound) {
    return {
      errors: { customerId: ['Please select a customer.'] },
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
  if (!invoiceFound) {
    // The invoice was deleted (or never existed): show the 404 page.
    notFound();
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await requireUser();

  const invoiceId = FormSchema.shape.id.parse(id);

  try {
    await sql`DELETE FROM invoices WHERE id = ${invoiceId}`;
  } catch (error) {
    // The delete button has no form state to show a message in, so a database
    // failure is thrown and caught by error.tsx (chapter 12).
    throw new Error(databaseMessage('Delete Invoice', error));
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard');
}

// Customer editing (added after the course). Same rules as the invoice actions:
// session check first, Zod validation with user-facing messages, SQL in try/catch,
// redirect/notFound kept outside it.
const CustomerSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Please enter a name.' })
    .trim()
    .min(1, { message: 'Please enter a name.' })
    .max(100, { message: 'The name is too long (100 characters at most).' }),
  email: z
    .string({ invalid_type_error: 'Please enter an email address.' })
    .trim()
    .min(1, { message: 'Please enter an email address.' })
    .max(254, { message: 'The email address is too long.' })
    .email({ message: 'Please enter a valid email address.' }),
});

export type CustomerState = {
  errors?: { name?: string[]; email?: string[] };
  message?: string | null;
  success?: boolean;
  // What was submitted, so the form can keep it after a validation error.
  values?: { name: string; email: string };
};

export async function updateCustomer(
  id: string,
  prevState: CustomerState,
  formData: FormData,
): Promise<CustomerState> {
  await requireUser();

  const customerId = FormSchema.shape.id.parse(id);

  const rawName = formData.get('name');
  const rawEmail = formData.get('email');
  const values = {
    name: typeof rawName === 'string' ? rawName : '',
    email: typeof rawEmail === 'string' ? rawEmail : '',
  };

  const validatedFields = CustomerSchema.safeParse({
    name: rawName,
    email: rawEmail,
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Customer.',
      values,
    };
  }

  const { name, email } = validatedFields.data;

  let customerFound = false;
  let emailTaken = false;
  try {
    const taken = await sql`
      SELECT 1 FROM customers WHERE lower(email) = lower(${email}) AND id <> ${customerId}
    `;
    emailTaken = taken.length > 0;
    if (!emailTaken) {
      const result = await sql`
        UPDATE customers SET name = ${name}, email = ${email} WHERE id = ${customerId}
      `;
      customerFound = result.count > 0;
    }
  } catch (error) {
    return { message: databaseMessage('Update Customer', error), values };
  }
  if (emailTaken) {
    return {
      errors: { email: ['Another customer already uses this email address.'] },
      message: 'Failed to Update Customer.',
      values,
    };
  }
  if (!customerFound) {
    notFound();
  }

  revalidatePath('/dashboard/customers');
  revalidatePath(`/dashboard/customers/${customerId}`);
  revalidatePath('/dashboard/invoices'); // invoices list shows the customer's name and email
  revalidatePath('/dashboard');
  return { success: true, message: 'Customer saved.', values: { name, email } };
}

// Chapter 14: called by the login form through useActionState.
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    // On success signIn() redirects by throwing; it must not be swallowed here.
    throw error;
  }
}
