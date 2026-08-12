export default function ProfilePage() {
  return (
    <main className="px-5 pt-8">
      <p className="text-sm text-zinc-500">VPN Config Hub</p>

      <h1 className="mt-1 text-2xl font-bold">Profile</h1>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-xl dark:bg-zinc-800">
            ?
          </div>

          <div>
            <p className="font-semibold">Telegram User</p>
            <p className="text-sm text-zinc-500">
              Not connected
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
