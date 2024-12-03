import { Button } from "@mui/material";

interface StyledButtonProps {
  text: string;
  onClick: () => void;
  styleType: "primary" | "secondary" | "danger" | "success";
  variant?: "contained" | "outlined" | "text";
  className?: string;
}

const StyledButton = ({
  text,
  onClick,
  className,
  variant = "contained",
}: StyledButtonProps) => {
  return (
    <Button
      onClick={onClick}
      sx={{ paddingY: "5px" }}
      className={`${className} text-white`}
      variant={variant}
    >
      {text}
    </Button>
  );
};

export default StyledButton;
