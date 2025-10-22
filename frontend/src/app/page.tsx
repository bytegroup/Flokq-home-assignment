import axios from "axios"

export const dynamic = "force-dynamic" // force SSR

export default async function HomePage() {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parts`)
    console.log(res.data);
    const parts:[] = res.data?.parts

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">Auto Parts</h1>
            <input
                type="text"
                placeholder="Search parts..."
                className="border rounded px-3 py-2 mb-6 w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {parts.map((part: any) => (
                    <div key={part.id} className="border rounded-lg p-4 shadow hover:shadow-md">
                        <h2 className="text-lg font-semibold">{part.name}</h2>
                        <p>Brand: {part.brand}</p>
                        <p>Price: ${part.price}</p>
                        <a
                            href={`/parts/${part.id}`}
                            className="text-blue-600 mt-2 inline-block"
                        >
                            View Details →
                        </a>
                    </div>
                ))}
            </div>
        </main>
    )
}
