import ast
import matplotlib.pyplot as plt

filename = input("Enter data file name (with .txt): ").strip()

counters = []
rssis = []

with open(filename, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()

        # Skip empty lines and summary
        if not line or not line.startswith("{"):
            continue

        try:
            data = ast.literal_eval(line)
        except Exception:
            continue

        if "Counter" in data and "rssi" in data:
            counters.append(data["Counter"])
            rssis.append(data["rssi"])

print(f"Loaded {len(counters)} valid data points")

if not counters:
    print("No valid data found.")
    exit()

plt.figure(figsize=(8, 5))
plt.plot(counters, rssis)
plt.xlabel("Counter")
plt.ylabel("RSSI")
plt.title("RSSI vs Counter (Gateway Movement Test)")
plt.grid(True)
plt.show()
