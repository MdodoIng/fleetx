export default function NoData() {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <img src="/images/nodata.png" alt="No data" className="mx-auto mb-4 w-24" />
      <p className="text-sm">Whoops! No data found</p>
    </div>
  );
}
