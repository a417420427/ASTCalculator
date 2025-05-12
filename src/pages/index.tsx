import AstCalculator from "@/components/AstCalculator";
import { DialogProvider } from "@/components/DialogService";
import { useEffect } from "react";

export default () => {
  useEffect(() => {});
  return (
    <DialogProvider>
      <div className="AstTree">
        <h3
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          二元运算AST树
        </h3>

        <AstCalculator />
      </div>
    </DialogProvider>
  );
};
