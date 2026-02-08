import { useEffect, useRef } from "react";

interface TradeSignal {
  time: string;
  type: "buy" | "sell";
  price: number;
}

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  signals: TradeSignal[];
  symbol?: string;
  timeframe?: string;
}

export function CandlestickChart({ data, signals, symbol, timeframe }: CandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size - use container's actual height
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const height = Math.max(rect.height, 320); // 使用新的容器高度
    
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const padding = { top: 20, right: 80, bottom: 50, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate price range
    const prices = data.flatMap((d) => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;

    const priceToY = (price: number) => {
      return (
        padding.top +
        chartHeight -
        ((price - (minPrice - pricePadding)) / (priceRange + 2 * pricePadding)) * chartHeight
      );
    };

    // Clear canvas
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#27272a";
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      // Price labels
      const price = maxPrice + pricePadding - (priceRange + 2 * pricePadding) * (i / 5);
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(price.toFixed(2), padding.left + chartWidth + 10, y + 4);
    }

    // Vertical grid lines
    const candleWidth = chartWidth / data.length;
    for (let i = 0; i <= data.length; i += Math.ceil(data.length / 6)) {
      const x = padding.left + candleWidth * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();

      // Date labels
      if (i < data.length) {
        ctx.fillStyle = "#a1a1aa";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        const date = new Date(data[i].time);
        ctx.fillText(
          `${date.getMonth() + 1}/${date.getDate()}`,
          x,
          padding.top + chartHeight + 20
        );
      }
    }

    // Draw candlesticks
    data.forEach((candle, index) => {
      const x = padding.left + candleWidth * index + candleWidth / 2;
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);

      const isGreen = candle.close >= candle.open;
      const color = isGreen ? "#10b981" : "#ef4444";

      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      const bodyWidth = candleWidth * 0.6;

      ctx.fillStyle = color;
      ctx.fillRect(x - bodyWidth / 2, bodyY, bodyWidth, Math.max(bodyHeight, 1));
    });

    // Draw trade signals
    signals.forEach((signal) => {
      const dataIndex = data.findIndex((d) => d.time === signal.time);
      if (dataIndex === -1) return;

      const x = padding.left + candleWidth * dataIndex + candleWidth / 2;
      const candle = data[dataIndex];
      const isBuy = signal.type === "buy";
      const y = isBuy ? priceToY(candle.low) + 20 : priceToY(candle.high) - 20;

      // Draw arrow
      ctx.fillStyle = isBuy ? "#10b981" : "#ef4444";
      ctx.beginPath();
      if (isBuy) {
        // Up arrow
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x - 6, y);
        ctx.lineTo(x + 6, y);
      } else {
        // Down arrow
        ctx.moveTo(x, y + 10);
        ctx.lineTo(x - 6, y);
        ctx.lineTo(x + 6, y);
      }
      ctx.closePath();
      ctx.fill();

      // Draw label
      ctx.fillStyle = isBuy ? "#10b981" : "#ef4444";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isBuy ? "买入" : "卖出", x, isBuy ? y + 15 : y - 15);
    });

    const handleResize = () => {
      if (containerRef.current) {
        const newRect = containerRef.current.getBoundingClientRect();
        if (newRect.width !== rect.width) {
          // Trigger re-render by forcing effect to run again
          window.dispatchEvent(new Event("resize"));
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data, signals]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}