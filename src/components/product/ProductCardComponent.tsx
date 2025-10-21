import { ProductCard } from "@/lib/models/product";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardComponent({
  product,
}: {
  product: ProductCard;
}) {
  // 販売前チェック（sale_start_atが未来の場合）
  const isComingSoon = new Date(product.sale_start_at) > new Date();
  // 在庫切れチェック
  const isSoldOut = product.stock === 0;

  return (
    <Link
      href={`products/${product.slug}`}
      className="group flex flex-col w-[65%] mx-auto"
    >
      {/* 円形画像 */}
      <div className="relative w-full aspect-square mb-2">
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <Image
            src={product.main_image_url || "/placeholder.png"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 768px) 42vw, 85vw"
            placeholder={product.main_image_blur ? "blur" : "empty"}
            blurDataURL={product.main_image_blur || undefined}
            className="object-cover transition-transform group-hover:scale-105 duration-300"
          />
        </div>

        {/* ステータス（画像直下） */}
      </div>

      {/* 商品情報 */}
      <div className="w-full px-1">
        {isComingSoon && (
          <p className="text-xs md:text-sm text-amber-600 font-light tracking-wider">
            COMING SOON
          </p>
        )}
        {isSoldOut && (
          <p className="text-xs md:text-sm text-gray-400 font-light tracking-wider">
            SOLD OUT
          </p>
        )}
        {/* 商品名 */}
        <h3 className="text-sm md:text-base font-medium text-gray-800 tracking-wide mb-0.5">
          {product.name}
        </h3>

        {/* 価格 */}
        <p className="text-sm md:text-base text-gray-600 text-right">
          ¥{product.price_yen.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
