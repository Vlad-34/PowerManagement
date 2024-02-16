import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface Props {
    chartName: number;
    values: number[];
    timestamps: number[];
    threshold: number;
}

const Chart: React.FC<Props> = (props) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (chartRef.current) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }
            const options = {
              fill: {
                colors: [function({ value } : {value: number}) {
                  if (value < props.threshold) {
                      return '#7fffd4'
                  } else {
                      return '#D9534F'
                  }
                }]
              },
                chart: {
                    type: 'bar',
                },
                series: [
                    {
                        name: 'sensor' + props.chartName.toString(),
                        data: props.values,
                    }
                ],
                xaxis: {
                    categories: props.timestamps
                }
            };

            chartInstance.current = new ApexCharts(chartRef.current, options);
            chartInstance.current.render();
        }
    }, [props.values, props.timestamps, props.threshold, props.chartName]);

    return <div ref={chartRef} />;
};

export default Chart;
