import axios from "axios"

export async function generateStaticParams() {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parts`)
    return res.data.parts.map((p: any) => ({ id: p.id.toString() }))
}

export default async function PartPage({ params }: { params: { id: string } }) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/parts/${params.id}`)
    const part = res.data

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">{part.name}</h1>
            <p>Brand: {part.brand}</p>
            <p>Category: {part.category}</p>
            <p>Price: ${part.price}</p>
        </main>
    )
}
