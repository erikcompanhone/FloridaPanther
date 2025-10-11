import './LineGraph.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

function LineGraph({ data }) {
    if (!data || data.length === 0) {
        return <div className="chart-placeholder">No data to display</div>;
    }

    return (
        <div className="line-graph-container">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                    data={data}
                    margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.PRIMARY} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={CHART_COLORS.PRIMARY} stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.1)"
                    />
                    <XAxis 
                        dataKey="Year"
                        stroke={CHART_COLORS.TEXT}
                        tick={{ fill: CHART_COLORS.TEXT, fontSize: 14 }}
                        tickLine={{ stroke: CHART_COLORS.TEXT }}
                    />
                    <YAxis 
                        stroke={CHART_COLORS.TEXT}
                        tick={{ fill: CHART_COLORS.TEXT, fontSize: 14 }}
                        tickLine={{ stroke: CHART_COLORS.TEXT }}
                    />
                    <Tooltip 
                        contentStyle={{
                            background: 'rgba(26, 26, 46, 0.95)',
                            border: `1px solid ${CHART_COLORS.PRIMARY}`,
                            borderRadius: '8px',
                            color: CHART_COLORS.TEXT
                        }}
                        cursor={{ stroke: CHART_COLORS.PRIMARY, strokeWidth: 2 }}
                    />
                    <Legend 
                        wrapperStyle={{
                            fontSize: '14px',
                            color: CHART_COLORS.TEXT
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="ObservationCount"
                        stroke={CHART_COLORS.PRIMARY}
                        strokeWidth={3}
                        fill="url(#colorCount)"
                        name="Observations"
                        dot={{ fill: CHART_COLORS.PRIMARY, r: 4 }}
                        activeDot={{ r: 6, fill: CHART_COLORS.SECONDARY }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LineGraph;

