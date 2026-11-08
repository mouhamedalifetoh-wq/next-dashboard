import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { display } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
import EmptyState from '@/app/ui/empty-state';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart() {
  const revenue = await fetchRevenue();

  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return (
      <div className="w-full md:col-span-4">
        <h2
          className={`${display.className} mb-4 text-xl font-semibold md:text-2xl`}
        >
          Recent Revenue
        </h2>
        <div className="v-glass">
          <EmptyState
            icon={ChartBarIcon}
            title="No revenue yet"
            message="Monthly revenue will appear here once there is data to show."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:col-span-4">
      <h2
        className={`${display.className} mb-4 text-xl font-semibold md:text-2xl`}
      >
        Recent Revenue
      </h2>
      <div className="v-glass p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-xl border-b border-white/10 p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-virus-mute sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month, i) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                title={`${month.month}: $${month.revenue.toLocaleString('en-US')}`}
                className="group w-full origin-bottom animate-grow-y rounded-t-md rounded-b-sm bg-gradient-to-b from-virus-neon to-emerald-800 shadow-[0_0_14px_-2px_rgba(43,255,136,0.4)] transition duration-200 hover:brightness-125"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                  animationDelay: `${300 + i * 45}ms`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-virus-mute sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-5">
          <CalendarIcon className="h-5 w-5 text-virus-mute" />
          <h3 className="ml-2 text-sm text-virus-mute ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
