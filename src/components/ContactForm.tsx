"use client";

import {
  createContactFormSchema,
  type ContactFormData,
  type ContactFormFormValues,
} from "@/lib/validations/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ContactFormConfirmation from "./ContactFormConfirmation";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isConfirming, setIsConfirming] = useState(false);
  const [formData, setFormData] = useState<ContactFormData | null>(null);

  const contactFormSchema = useMemo(() => createContactFormSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormFormValues, undefined, ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onConfirm = (data: ContactFormData) => {
    setFormData(data);
    setIsConfirming(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onEdit = () => {
    setIsConfirming(false);
  };

  const onSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(t("errors.submitFailed"));
      }

      setSubmitStatus("success");
      setIsConfirming(false);
      reset();
      setFormData(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message
  if (submitStatus === "success") {
    return (
      <div className="text-center space-y-8">
        <div className="p-8 bg-stone-100 border border-gray-200 text-gray-800">
          <h3 className="text-xl mb-4">{t("success.title")}</h3>
          <p className="text-base whitespace-pre-line">
            {t("success.message")}
          </p>
        </div>
      </div>
    );
  }

  // Show confirmation screen
  if (isConfirming && formData) {
    return (
      <ContactFormConfirmation
        data={formData}
        onEdit={onEdit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitError={submitStatus === "error"}
      />
    );
  }

  // Show form
  return (
    <form onSubmit={handleSubmit(onConfirm)} className="space-y-8">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm md:text-base text-gray-700 mb-2"
        >
          {t("labels.name")}{" "}
          <span className="text-red-500">{t("labels.required")}</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none transition-colors"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm md:text-base text-gray-700 mb-2"
        >
          {t("labels.companyName")}{" "}
          <span className="ml-1 text-xs text-gray-400">
            {t("labels.optional")}
          </span>
        </label>
        <input
          id="companyName"
          type="text"
          {...register("companyName")}
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none transition-colors"
        />
        {errors.companyName && (
          <p className="mt-1 text-sm text-red-500">
            {errors.companyName.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm md:text-base text-gray-700 mb-2"
        >
          {t("labels.phone")}{" "}
          <span className="text-red-500">{t("labels.required")}</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none transition-colors"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm md:text-base text-gray-700 mb-2"
        >
          {t("labels.email")}{" "}
          <span className="text-red-500">{t("labels.required")}</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none transition-colors"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Email Confirmation */}
      <div>
        <label
          htmlFor="emailConfirmation"
          className="block text-sm md:text-base text-gray-700 mb-2"
        >
          {t("labels.emailConfirmation")}{" "}
          <span className="text-red-500">{t("labels.required")}</span>
        </label>
        <input
          id="emailConfirmation"
          type="email"
          {...register("emailConfirmation")}
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none transition-colors"
        />
        {errors.emailConfirmation && (
          <p className="mt-1 text-sm text-red-500">
            {errors.emailConfirmation.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm md:text-base text-gray-700 mb-2"
        >
          {t("labels.message")}{" "}
          <span className="text-red-500">{t("labels.required")}</span>
        </label>
        <textarea
          id="message"
          rows={8}
          {...register("message")}
          className="w-full px-4 py-3 border border-gray-300 focus:border-gray-500 focus:outline-none transition-colors resize-none"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center pt-4">
        <button
          type="submit"
          className="inline-block border-2 border-gray-800 text-gray-800 px-12 py-4 hover:bg-gray-800 hover:text-white transition-colors duration-300 text-sm tracking-widest"
        >
          {t("buttons.confirm")}
        </button>
      </div>
    </form>
  );
}
