import { formatTime } from "../util/timeUtils.js";

describe("formatTime", () => {
  it("returns any number under 10 with a precedint 0", () => {
    expect(formatTime(9)).toBe("09");
    expect(formatTime(0)).toBe("00");
  });

  it("returns the input as output if its > 9 and < 60", () => {
    expect(formatTime(10)).toBe("10");
    expect(formatTime(59)).toBe("59");
  });

  it("converts any seconds between 60 and 3600 to be in minutes + seconds", () => {
    expect(formatTime(61)).toBe("1m:01s");
    expect(formatTime(3599)).toBe("59m:59s");
  });

  it("converts any time over 60 minutes to show hours", () => {
    expect(formatTime(3600)).toBe("1h:00m:00s");
    expect(formatTime(7200)).toBe("2h:00m:00s");
    expect(formatTime(7400)).toBe("2h:03m:20s");
  });
});
