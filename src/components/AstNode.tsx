import { AstNode } from "@/utils/ast";
import { useEffect, useRef, useState } from "react";

const AstNodeDom = (props: {
  ast: AstNode;
  parentPosition?: { x: number; y: number };
  createSvgLine: (x1: number, y1: number, x2: number, y2: number) => void;
  getChildPosition?: (position: { x: number; y: number }) => void;
}) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const binaryOpRef = useRef<HTMLDivElement>(null);
  const [curPosition, setCurPosition] = useState({ x: 0, y: 0 });

  const NodeSize = 24;
  useEffect(() => {
    // 当前节点位置记录
    const current = binaryOpRef.current || valueRef.current;
    if (current) {
      const rect = current.getBoundingClientRect();
      const pos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height,
      };
      setCurPosition(pos);
    }
  }, []);

  useEffect(() => {
    // 如果每个节点都有位置信息，则绘制连线
    if (
      curPosition.x &&
      curPosition.y &&
      props.parentPosition?.x &&
      props.parentPosition?.y
    ) {
      props.createSvgLine(
        props.parentPosition.x,
        props.parentPosition.y,
        curPosition.x,
        curPosition.y - NodeSize
      );
    }
  }, [curPosition, props.parentPosition]);

  return (
    <div style={styles.node}>
      {typeof props.ast === "number" ? (
        <div ref={valueRef} style={styles.value}>
          {props.ast}
        </div>
      ) : (
        <>
          <div ref={binaryOpRef} style={styles.value}>
            {props.ast.binaryOp}
          </div>
          <div style={styles.children}>
            <AstNodeDom
              parentPosition={curPosition}
              createSvgLine={props.createSvgLine}
              ast={props.ast.left}
            />
            <AstNodeDom
              parentPosition={curPosition}
              createSvgLine={props.createSvgLine}
              ast={props.ast.right}
            />
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  tree: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    position: "relative",
  },
  node: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  value: {
    padding: "6px 12px",
    border: "2px solid #333",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    zIndex: 1,
  },
  children: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
    gap: "40px",
    position: "relative",
  },
};

export default AstNodeDom;
