import Image from "next/image";

export default function Testimonial() {
  return (
    <section className="py-20 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <span className="absolute top-0 left-0 text-9xl text-gray-200 dark:text-gray-800 font-serif leading-none -translate-x-8 -translate-y-8 select-none">
          &ldquo;
        </span>
        <div className="relative z-10 bg-surface-light dark:bg-surface-dark p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 text-center md:text-left flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-shrink-0">
            <Image
              alt="Sarah Jenkins"
              className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLa22rHM7cclHoZk_PxKE1qScMOis9maQCMwegf0iKkChTLkFbLiu3yqmObrBzdmqZdwkxbwidg5B895Rfwg_NDGTRzrepjj9c6z8tfS6Q9WyGfh4gyR7M9UetsuLHF677JW70zbHZEXoyJni_Zi5JZwZ5glGKtfiqkUvXGkViS7ayL6LTaZl8zLvOKTRlZneu1pQby3m6yetjMzgmFtgwVsW_r8nTtBgkSBF7MqcZrSr2ammmcTJMDoJQI8XQDVVZDaR8jriReDrR"
              width={96}
              height={96}
            />
          </div>
          <div>
            <p className="text-lg md:text-xl font-medium text-text-light dark:text-text-dark mb-6 italic leading-relaxed">
              &ldquo;Every engineer knows the pain of grinding LeetCode alone.
              With Skillscout, I had a personalized coach that helped me crack
              the System Design round at Google. It&apos;s not just practice;
              it&apos;s proper preparation.&rdquo;
            </p>
            <div>
              <div className="font-bold text-text-light dark:text-text-dark">
                Sarah Jenkins
              </div>
              <div className="text-sm text-primary">
                Senior Software Engineer at Google
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
