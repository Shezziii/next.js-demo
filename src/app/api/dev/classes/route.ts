export function GET() {
  return Response.json({
    success: true,
    data: [
      { id: "1", name: "HIIT Burn" },
      { id: "2", name: "Power Yoga" },
    ],
  });
}
