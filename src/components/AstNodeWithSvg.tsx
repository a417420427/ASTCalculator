import { useRef, useState } from "react";
import AstNodeDom from "./AstNode";
import { AstNode } from "@/utils/ast";

const AstNodeDomWidthSvg: React.FC<{ node: AstNode }> = ({ node }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<
    { x1: number; y1: number; x2: number; y2: number }[]
  >([]);

  const createSvgLine = (x1: number, y1: number, x2: number, y2: number) => {
    if(containerRef.current) {
      const {left, top} = containerRef.current.getBoundingClientRect();
      setLines((l) => [...l, { x1: x1 - left, y1: y1 - top, x2: x2 - left, y2: y2 - top }]);
    }
   
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <svg style={styles.connector} ref={svgRef}>
        {lines.map((line) => (
          <line
            style={styles.line}
            key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
            {...line}
          ></line>
        ))}
      </svg>
      <AstNodeDom createSvgLine={createSvgLine} ast={node} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } ={
  connector: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  line: {
    stroke: '#000',
    strokeWidth: 2,
  }
}
export default AstNodeDomWidthSvg;
