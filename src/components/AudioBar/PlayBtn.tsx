import { useRedux } from "@/hooks";
import classnames from "classnames";

export default function PlayBtn({ className }: classNameType) {
  const { store, dispatch } = useRedux();

  const { play } = store;

  const onplay = (e: any) => {
    e.stopPropagation();
    dispatch({ type: "CHANGE_PlAY", payload: !play });
  };

  return (
    <span
      className={classnames("iconfont", className, {
        "icon-bofang": !play,
        "icon-zanting": play,
      })}
      onClick={onplay}
    ></span>
  );
}
