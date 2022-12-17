import styles from "./style.less";

export default function Banner() {
  return (
    <div id={styles.banner}>
      <h1>推荐曲目</h1>
      <p>
        更新日期：{new Date().getMonth() + 1}月{new Date().getDate()}日
      </p>
    </div>
  );
}
