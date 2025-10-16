import { ProductCard } from "@/lib/models/product";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardComponent({
  product,
}: {
  product: ProductCard;
}) {
  return (
    <div
      key={product.id}
      className={`border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col ${
        product.status === "draft"
          ? "opacity-70"
          : product.status === "archived"
          ? "grayscale"
          : ""
      }`}
    >
      <div className="w-full aspect-square relative mb-3">
        <Image
          src={product.main_image_url || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          placeholder={product.main_image_blur ? "blur" : "empty"}
          blurDataURL={product.main_image_blur || undefined}
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
          <p className="text-gray-700">
            ¥{(product.price_cents).toLocaleString()}
          </p>
        </div>

        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <span>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
          <span className="capitalize">{product.status}</span>
        </div>
      </div>

      <Link
        href={`products/${product.slug}`}
        className="mt-4 inline-block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        View Details
      </Link>
    </div>
  );
}
