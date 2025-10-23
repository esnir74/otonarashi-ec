import { ContactFormData } from "@/lib/validations/contact";

interface ContactFormConfirmationProps {
  data: ContactFormData;
  onEdit: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: boolean;
}

export default function ContactFormConfirmation({
  data,
  onEdit,
  onSubmit,
  isSubmitting,
  submitError,
}: ContactFormConfirmationProps) {
  const trimmedCompanyName = (data.companyName ?? "").trim();
  const hasCompanyName = trimmedCompanyName.length > 0;
  const companyNameDisplay = hasCompanyName ? trimmedCompanyName : "（未入力）";

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h3 className="text-xl md:text-2xl text-gray-900">
          入力内容をご確認ください
        </h3>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm text-center">
          送信中にエラーが発生しました。もう一度お試しください。
        </div>
      )}

      <div className="bg-gray-50 p-8 space-y-6">
        {/* Name */}
        <div className="border-b border-gray-200 pb-4">
          <dt className="text-sm md:text-base text-gray-600 mb-2">お名前</dt>
          <dd className="text-base md:text-lg text-gray-900">{data.name}</dd>
        </div>

        {/* Company Name */}
        <div className="border-b border-gray-200 pb-4">
          <dt className="text-sm md:text-base text-gray-600 mb-2">
            法人名・団体名
          </dt>
          <dd
            className={`text-base md:text-lg ${
              hasCompanyName ? "text-gray-900" : "text-gray-500 italic"
            }`}
          >
            {companyNameDisplay}
          </dd>
        </div>

        {/* Phone */}
        <div className="border-b border-gray-200 pb-4">
          <dt className="text-sm md:text-base text-gray-600 mb-2">
            電話番号
          </dt>
          <dd className="text-base md:text-lg text-gray-900">{data.phone}</dd>
        </div>

        {/* Email */}
        <div className="border-b border-gray-200 pb-4">
          <dt className="text-sm md:text-base text-gray-600 mb-2">
            メールアドレス
          </dt>
          <dd className="text-base md:text-lg text-gray-900">{data.email}</dd>
        </div>

        {/* Message */}
        <div>
          <dt className="text-sm md:text-base text-gray-600 mb-2">
            お問い合わせ内容
          </dt>
          <dd className="text-base md:text-lg text-gray-900 whitespace-pre-wrap">
            {data.message}
          </dd>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
        <button
          type="button"
          onClick={onEdit}
          disabled={isSubmitting}
          className="inline-block border-2 border-gray-400 text-gray-700 px-12 py-4 hover:bg-gray-100 transition-colors duration-300 text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          内容を修正する
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-block border-2 border-gray-800 text-gray-800 px-12 py-4 hover:bg-gray-800 hover:text-white transition-colors duration-300 text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "送信中..." : "この内容で送信する"}
        </button>
      </div>
    </div>
  );
}
