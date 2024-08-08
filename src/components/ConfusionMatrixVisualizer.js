import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ConfusionMatrixVisualizer = () => {
  const [tp, setTp] = useState(80);
  const [tn, setTn] = useState(80);
  const [fp, setFp] = useState(20);
  const [fn, setFn] = useState(20);

  const total = useMemo(() => tp + tn + fp + fn, [tp, tn, fp, fn]);
  const accuracy = useMemo(() => ((tp + tn) / total * 100).toFixed(2), [tp, tn, total]);
  const precision = useMemo(() => ((tp / (tp + fp)) * 100).toFixed(2), [tp, fp]);
  const recall = useMemo(() => ((tp / (tp + fn)) * 100).toFixed(2), [tp, fn]);
  const f1Score = useMemo(() => ((2 * tp) / (2 * tp + fp + fn) * 100).toFixed(2), [tp, fp, fn]);

  const getColor = (value) => {
    const hue = ((value / 100) * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Metrics Comparison',
        font: {
          size: 20,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };

  const MetricCard = ({ title, value, description }) => (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold" style={{ color: getColor(value) }}>{value}%</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  const metricsComparisonData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
    datasets: [
      {
        label: 'Metrics Comparison',
        data: [accuracy, precision, recall, f1Score],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Confusion Matrix Visualizer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Confusion Matrix</h2>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-green-200 p-2 rounded">
              <p>True Positive (TP)</p>
              <p className="text-2xl font-bold">{tp}</p>
            </div>
            <div className="bg-red-200 p-2 rounded">
              <p>False Positive (FP)</p>
              <p className="text-2xl font-bold">{fp}</p>
            </div>
            <div className="bg-red-200 p-2 rounded">
              <p>False Negative (FN)</p>
              <p className="text-2xl font-bold">{fn}</p>
            </div>
            <div className="bg-green-200 p-2 rounded">
              <p>True Negative (TN)</p>
              <p className="text-2xl font-bold">{tn}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Adjust Values</h2>
          <div className="space-y-4">
            {['True Positive (TP)', 'True Negative (TN)', 'False Positive (FP)', 'False Negative (FN)'].map((label, index) => (
              <div key={label}>
                <label>{label}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={index === 0 ? tp : index === 1 ? tn : index === 2 ? fp : fn}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (index === 0) setTp(value);
                    else if (index === 1) setTn(value);
                    else if (index === 2) setFp(value);
                    else setFn(value);
                  }}
                  className="w-full"
                />
                <div className="text-right text-sm">{index === 0 ? tp : index === 1 ? tn : index === 2 ? fp : fn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Accuracy"
          value={accuracy}
          description="Overall correctness of predictions"
        />
        <MetricCard
          title="Precision"
          value={precision}
          description="Accuracy of positive predictions"
        />
        <MetricCard
          title="Recall"
          value={recall}
          description="Ability to find all positive instances"
        />
        <MetricCard
          title="F1 Score"
          value={f1Score}
          description="Harmonic mean of precision and recall"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div style={{ height: '400px' }}>
          <Bar data={metricsComparisonData} options={chartOptions} />
        </div>
        <p className="mt-4 text-sm text-gray-600">This bar chart compares the different evaluation metrics side by side.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Understanding the Metrics</h2>
        <div className="space-y-2">
          <p><strong>Accuracy:</strong> The proportion of correct predictions (both true positives and true negatives) among the total number of cases examined.</p>
          <p><strong>Precision:</strong> The proportion of correct positive identifications. It answers the question: "Of all the instances predicted as positive, how many actually were positive?"</p>
          <p><strong>Recall:</strong> The proportion of actual positive cases that were correctly identified. It answers the question: "Of all the actual positive instances, how many were correctly identified?"</p>
          <p><strong>F1 Score:</strong> The harmonic mean of precision and recall, providing a single score that balances both metrics.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Error Types Explanation</h2>
        <div className="space-y-2">
          <p><strong>Type I Error (False Positive):</strong> Incorrectly predicting a positive result when the true outcome is negative. In this case, FP = {fp}.</p>
          <p><strong>Type II Error (False Negative):</strong> Incorrectly predicting a negative result when the true outcome is positive. In this case, FN = {fn}.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrixVisualizer;
