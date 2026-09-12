import Card from './Card'

/* Two header shapes exist in the reference: title+subtitle stacked above the chart, or
   title+subtitle on the left with a legend row on the right.

   Responsive note: the legend variant was a plain `flex items-center justify-between`,
   which overflows once the card is narrower than title + legend. It now stacks below `sm`
   and wraps the chips; from `sm` up the rendered result is unchanged. */
export default function ChartCard({
  title,
  subtitle,
  legend,
  legendGap = 'gap-3',
  height,
  className = '',
  children,
}) {
  return (
    <Card className={className}>
      {legend ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="font-display font-600 text-[15px]">{title}</h3>
            <p className="text-[11px] text-mut">{subtitle}</p>
          </div>
          <div className={`flex items-center flex-wrap ${legendGap} text-[11px]`}>{legend}</div>
        </div>
      ) : (
        <>
          <h3 className="font-display font-600 text-[15px] mb-1">{title}</h3>
          <p className="text-[11px] text-mut mb-4">{subtitle}</p>
        </>
      )}
      <div className={height}>{children}</div>
    </Card>
  )
}
