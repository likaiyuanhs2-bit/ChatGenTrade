import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface TradeSignal {
  time: string;
  type: "buy" | "sell";
  price: number;
}

interface TradingViewChartProps {
  data: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  signals: TradeSignal[];
  symbol?: string;
  timeframe?: string;
}

export function TradingViewChart({ data, signals }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#1a1a1a" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    candlestickSeries.setData(data);

    // Add buy/sell markers
    const markers = signals.map((signal) => ({
      time: signal.time as any,
      position: signal.type === "buy" ? ("belowBar" as const) : ("aboveBar" as const),
      color: signal.type === "buy" ? "#10b981" : "#ef4444",
      shape: signal.type === "buy" ? ("arrowUp" as const) : ("arrowDown" as const),
      text: signal.type === "buy" ? "买入" : "卖出",
    }));

    candlestickSeries.setMarkers(markers);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, signals]);

  return <div ref={chartContainerRef} className="w-full" />;
}
