import './BarGraph.css';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, Tooltip, Cell } from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

function BarGraph({ data }) {
    if (!data || data.length === 0) {
        return <div className="chart-placeholder">No data to display</div>;
    }

    // Generate gradient colors for bars
    const colors = data.map((_, index) => {
        const ratio = index / Math.max(data.length - 1, 1);
        return `hsl(${45 - ratio * 15}, 100%, ${65 - ratio * 15}%)`;
    });

    return (
        <div className="bar-graph-container">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    layout="vertical" 
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                    <XAxis 
                        type="number" 
                        domain={[0, 'dataMax']}
                        stroke={CHART_COLORS.TEXT}
                        tick={{ fill: CHART_COLORS.TEXT, fontSize: 14 }}
                        tickLine={{ stroke: CHART_COLORS.TEXT }}
                    />
                    <YAxis 
                        dataKey="Cause" 
                        type="category" 
                        width={150}
                        stroke={CHART_COLORS.TEXT}
                        tick={{ fill: CHART_COLORS.TEXT, fontSize: 13 }}
                        interval={0}
                    />
                    <Legend 
                        wrapperStyle={{
                            paddingTop: '15px',
                            fontSize: '14px',
                            color: CHART_COLORS.PRIMARY
                        }}
                        iconSize={12}
                        iconType="rect"
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'rgba(26, 26, 46, 0.95)',
                            border: `1px solid ${CHART_COLORS.PRIMARY}`,
                            borderRadius: '8px',
                            color: CHART_COLORS.TEXT
                        }}
                        cursor={{ fill: 'rgba(255, 215, 0, 0.1)' }}
                    />
                    <Bar 
                        dataKey="CauseCount"
                        name="Deaths"
                        barSize={25}
                        radius={[0, 8, 8, 0]}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BarGraph;
