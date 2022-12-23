import { useRedux } from "@/hooks";
import { httpTohttps } from "@/utils";
import classnames from "classnames";

export default function AlBum({ className }) {
  const { store } = useRedux();

  const { ing, play } = store;

  return (
    <img
      className={classnames("album", className, {
        "animation-stop": !play,
      })}
      src={httpTohttps(ing.al?.picUrl)}
    />
  );
}
