export enum BinaryOp {
  ADD = "+",
  SUB = "-",
  MUL = "*",
  DIV = "/",
}

export type AstNode = AstTree | number;

export class AstTree {
  left: AstNode = 0;
  right: AstNode = 0;
  binaryOp = BinaryOp.ADD;
  result = 0
  constructor(left: AstNode, right: AstNode, binaryOp: BinaryOp) {
    this.left = left;
    this.right = right;
    this.binaryOp = binaryOp;
  }
}

export interface HistoryAst {
  deleted: Boolean;
  id: number;         // 唯一标识
  ast: AstTree;
  result: number;
}


export const localStorageKey = "ast-tree";

export const saveLocalTree = (trees: HistoryAst[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(trees));
};

export const getLocalTree = () => {
  const treeStr = localStorage.getItem(localStorageKey);
  if (!treeStr) return [];
  return JSON.parse(treeStr) as HistoryAst[];
};