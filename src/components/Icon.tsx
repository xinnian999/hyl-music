import classNames from "classnames";

type iconType = {
  type: string;
  className?: string;
  onClick?: () => void;
};

export default function Icon({ type, className, onClick }: iconType) {
  return (
    <span
      onClick={onClick}
      className={classNames("iconfont", type, className)}
    />
  );
}
