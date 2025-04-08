/**
 * @description 格式化时间
 * @param time  时间戳或日期字符串
 * @param format  自定义格式，默认为 "YY-MM-DD hh:mm:ss"
 * @returns string
 */

export function formatDate(time: string | number, format = "YY-MM-DD hh:mm:ss"): string {
  // 输入校验：确保 time 是有效的日期或时间戳
  if (!time) return "";

  let date: Date;
  try {
    // 尝试将 time 转换为 Date 对象
    if (typeof time === "string") {
      date = new Date(time);
    } else if (typeof time === "number") {
      date = new Date(time);
    } else {
      throw new Error("Invalid time input");
    }

    // 检查是否为有效日期
    if (isNaN(date.getTime())) {
      return "";
    }
  } catch (error) {
    return ""; // 如果转换失败，返回空字符串
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // 使用 Map 存储占位符及其对应的值
  const preMap: { [key: string]: string } = {
    YY: year.toString(),
    MM: padZero(month),
    DD: padZero(day),
    hh: padZero(hour),
    mm: padZero(minute),
    ss: padZero(second)
  };

  // 替换 format 中的所有占位符
  const newTime = format.replace(/YY|MM|DD|hh|mm|ss/g, match => preMap[match] || match);

  return newTime;
}

// 辅助函数：为数字添加前导零
function padZero(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}
