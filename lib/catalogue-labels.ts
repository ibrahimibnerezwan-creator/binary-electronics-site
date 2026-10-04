// Keep database names and URLs intact while presenting the existing catalogue clearly.
export function categoryLabel(name: string): string {
  const labels: Record<string, string> = {
    "power supply": "Power supplies",
    "ecu repair": "ECU repair",
    "parts//componet": "Parts & components",
    "welding maching": "Welding machines",
    stabilizer: "Voltage stabilizers",
  };
  return labels[name.toLowerCase()] || name;
}
