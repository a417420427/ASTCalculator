import {
  AstNode,
  AstTree,
  BinaryOp,
  getLocalTree,
  HistoryAst,
  saveLocalTree,
} from "@/utils/ast";
import React, { useEffect, useState } from "react";
import AstNodeDomWidthSvg from "./AstNodeWithSvg";
import { useDialog } from "./DialogService";

const evaluateAst = (node: AstNode): number => {
  if (typeof node === "number") return node;
  const left = evaluateAst(node.left);
  const right = evaluateAst(node.right);

  switch (node.binaryOp) {
    case BinaryOp.ADD:
      return left + right;
    case BinaryOp.SUB:
      return left - right;
    case BinaryOp.MUL:
      return left * right;
    case BinaryOp.DIV:
      if (right === 0) throw new Error("除数不能为 0");
      return left / right;
    default:
      throw new Error("未知运算符");
  }
};

const AstCalculator: React.FC = () => {
  const [leftInput, setLeftInput] = useState<number | HistoryAst>(0);
  const [rightInput, setRightInput] = useState<number | HistoryAst>(0);
  const [operator, setOperator] = useState<BinaryOp>(BinaryOp.ADD);
  const [currentAst, setCurrentAst] = useState<AstTree | null>(null);
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<HistoryAst[]>([]);

  const { openDialog } = useDialog();

  const buildAndCalculate = () => {
    try {
      const left = typeof leftInput === "number" ? leftInput : leftInput.ast;
      const right =
        typeof rightInput === "number" ? rightInput : rightInput.ast;
      const tree = new AstTree(left, right, operator);
      const res = evaluateAst(tree);
      setCurrentAst(tree);
      setResult(`结果：${res}`);
      const newHistory = [
        { ast: tree, result: res, id: history.length + 1, deleted: false },
        ...history,
      ];
      setHistory(newHistory);
      saveLocalTree(newHistory);
    } catch (e: any) {
      setResult(`错误：${e.message}`);
    }
  };

  const handleSelectFromHistory = (
    historyAst: HistoryAst,
    side: "left" | "right"
  ) => {
    if (side === "left") setLeftInput(historyAst);
    else setRightInput(historyAst);
  };

  const onClearHistory = () => {
    setHistory([])
    saveLocalTree([]);
  }
  const onViewAstTree = (ast: AstTree) => {
    openDialog({
      content: <AstNodeDomWidthSvg node={ast} />,
    });
  };
  useEffect(() => {
    setHistory(getLocalTree());
  }, []);
  return (
    <div style={styles.container}>
      <h2>AST 二元运算器（含历史）</h2>
      <div style={styles.inputs}>
        {typeof leftInput === "number" ? (
          <input
            type="number"
            value={leftInput}
            onChange={(e) => setLeftInput(parseFloat(e.target.value))}
            style={styles.input}
          />
        ) : (
          <div>
            <button onClick={() => setLeftInput(0)} style={styles.buttonMini}>改用输入</button>
            <b>AST Id: </b>
            {leftInput.id}
          </div>
        )}

        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value as BinaryOp)}
          style={styles.select}
        >
          <option value={BinaryOp.ADD}>＋</option>
          <option value={BinaryOp.SUB}>－</option>
          <option value={BinaryOp.MUL}>×</option>
          <option value={BinaryOp.DIV}>÷</option>
        </select>
        {typeof rightInput === "number" ? (
          <input
            type="number"
            value={rightInput}
            onChange={(e) => setRightInput(parseFloat(e.target.value))}
            style={styles.input}
          />
        ) : (
          <div>
            <button onClick={() => setRightInput(0)} style={styles.buttonMini}>改用输入</button>
            <b>AST Id: </b>
            {rightInput.id}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => setCurrentAst(null)} style={styles.button}>
          清除当前结果
        </button>
        <button onClick={onClearHistory} style={styles.button}>
          清除历史
        </button>
        <button onClick={buildAndCalculate} style={styles.button}>
          构建并计算
        </button>
      </div>

      {currentAst && (
        <div style={styles.resultBox}>
          <strong>AST:</strong>
          <pre>{JSON.stringify(currentAst, null, 2)}</pre>
          <div>
            <strong>{result}</strong>
          </div>
        </div>
      )}

      <h3>历史记录（点击设为左/右输入）</h3>
      <div style={styles.history}>
        {history.map((entry, index) => (
          <div key={index} style={styles.historyItem}>
            <div style={styles.historyButtons}>
              <button
                style={styles.buttonMini}
                onClick={() => handleSelectFromHistory(entry, "left")}
              >
                设为左侧输入
              </button>
              <button
                style={styles.buttonMini}
                onClick={() => handleSelectFromHistory(entry, "right")}
              >
                设为右侧输入
              </button>
              <button
                style={styles.buttonMini}
                onClick={() => onViewAstTree(entry.ast)}
              >
                查看AST树
              </button>
            </div>
            <pre style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(entry.ast)}
            </pre>
            <div>
              <strong>ID: {entry.id}</strong>&nbsp;
              <strong>结果: {entry.result}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#fff",
    padding: "20px 30px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  inputs: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100px",
  },
  select: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "6px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    margin: '0 12px'
  },
  buttonMini: {
    padding: "4px 8px",
    fontSize: "12px",
    backgroundColor: "#2A7FFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: '0 4px'
  },
  resultBox: {
    marginTop: "20px",
    textAlign: "left",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
  },
  history: {
    marginTop: "20px",
    textAlign: "left",
  },
  historyItem: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "10px",
    background: "#f9f9f9",
  },
  historyButtons: {
    display: "flex",
    gap: "10px",
    marginBottom: "6px",
  },
};

export default AstCalculator;
