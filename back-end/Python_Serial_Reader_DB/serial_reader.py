import serial
import json
import re
from datetime import datetime

PORT = "COM3"
BAUD_RATE = 115200

PACKET_REGEX = re.compile(r'(\{.*\})\s*(-\d+)$')

corrupted_count = 0
total_count = 0
saved_count = 0


def extract_packet(line):
    match = PACKET_REGEX.search(line)
    if not match:
        return None

    json_part = match.group(1)
    rssi_raw = int(match.group(2))

    try:
        data = json.loads(json_part)
    except json.JSONDecodeError:
        return None

    data["rssi"] = abs(rssi_raw)
    data["timestamp"] = datetime.now().isoformat()

    return data


def main():
    global corrupted_count, total_count, saved_count

    filename = input("Enter data file name (no extension): ").strip()
    if not filename:
        filename = "data"

    filename += ".txt"

    ser = serial.Serial(PORT, BAUD_RATE, timeout=1)

    print(f"\nLogging valid packets to: {filename}")
    print("Corrupted packets will be shown but not saved.\n")

    with open(filename, "w", encoding="utf-8") as f:
        f.write("=== SERIAL LOG START ===\n\n")

        try:
            while True:
                raw = ser.readline().decode("utf-8", errors="ignore").strip()
                if not raw:
                    continue

                total_count += 1
                packet = extract_packet(raw)

                if packet:
                    saved_count += 1
                    print("OK :", packet)

                    f.write(str(packet) + "\n")
                    f.flush()
                else:
                    corrupted_count += 1
                    print("BAD:", raw)   # 👈 show corrupted line

        except KeyboardInterrupt:
            print("\nStopping capture...")

            summary = (
                f"\n=== SUMMARY ===\n"
                f"Total lines received: {total_count}\n"
                f"Valid packets saved: {saved_count}\n"
                f"Corrupted packets: {corrupted_count}\n"
                f"Corruption rate: "
                f"{(100 * corrupted_count / total_count):.2f}%\n"
            )

            print(summary)
            f.write(summary)

        finally:
            ser.close()


if __name__ == "__main__":
    main()
