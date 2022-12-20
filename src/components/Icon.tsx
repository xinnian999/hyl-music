import classNames from "classnames";

type iconType = {
  type: string;
  className?: string;
};

export default function Icon({ type, className }: iconType) {
  return <span className={classNames("iconfont", type, className)} />;
}
