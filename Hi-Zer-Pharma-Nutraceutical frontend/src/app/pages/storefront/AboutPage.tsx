import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone } from "lucide-react";
import { ff, fs } from "../../lib/constants";
import { contactApi } from "../../api/contact";
import { ApiClientError } from "../../api/client";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export default function AboutPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(data: ContactForm) {
    setStatus("sending");
    try {
      await contactApi.send(data.name, data.email, data.message);
      setStatus("sent");
      reset();
    } catch (err) {
      setStatus("error");
      void err;
    }
  }

  return (
    <div>
      <section style={{ background: "#eef4f1" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[11px] font-bold text-[#28a869] uppercase tracking-[0.18em] mb-3" style={ff}>Our Story</p>
              <h1 className="text-4xl font-bold text-[#0c1a16] mb-6 leading-tight" style={fs}>
                Bringing premium healthcare closer to every home
              </h1>
              <p className="text-[#0c1a16]/60 leading-relaxed mb-4 text-sm" style={ff}>
                Hi-Zer Pharma & Nutraceutical was founded with a singular mission: to make science-backed, pharmacist-reviewed healthcare products accessible to every Pakistani household.
              </p>
              <p className="text-[#0c1a16]/60 leading-relaxed text-sm" style={ff}>
                We work with certified pharmaceutical manufacturers and clinical nutritionists to curate a range that meets the highest standards of safety, efficacy, and purity.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=620&h=420&fit=crop"
                alt="Hi-Zer team"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-[#0c1a16] mb-4" style={fs}>Our Mission</h2>
          <p className="text-[#0c1a16]/55 leading-relaxed text-sm" style={ff}>
            To empower individuals with trusted, clinically verified pharmaceutical and nutraceutical products — bridging the gap between professional healthcare guidance and everyday wellness.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Clinical Verification", desc: "Every product is reviewed by our certified pharmacist team before it reaches our customers.", icon: "🔬" },
            { title: "Nationwide Delivery", desc: "Secure, tracked shipping across Pakistan — Lahore, Karachi, Islamabad, and beyond.", icon: "🇵🇰" },
            { title: "Patient Privacy", desc: "Discreet packaging and strict data privacy — especially for sensitive health categories.", icon: "🔒" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-[#0c1a16] mb-2" style={ff}>{item.title}</h3>
              <p className="text-sm text-[#0c1a16]/55 leading-relaxed" style={ff}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#eef4f1" }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0c1a16] mb-7" style={fs}>Get in Touch</h2>
              <div className="space-y-5" style={ff}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#0c3f35]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-[#0c3f35]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0c1a16]">Address</p>
                    <p className="text-sm text-[#0c1a16]/55 mt-0.5">Plot No. 246, F Block, Sabzazar,<br />Multan Road, Lahore</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0c3f35]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-[#0c3f35]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0c1a16]">Phone</p>
                    <p className="text-sm text-[#0c1a16]/55 mt-0.5">0321 4544343</p>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 border border-[#0c3f35]/8">
              <h3 className="font-bold text-[#0c1a16] mb-4" style={ff}>Send a Message</h3>
              {status === "sent" ? (
                <p className="text-sm text-[#28a869] font-medium" style={ff}>
                  Thanks — your message has been sent. We'll get back to you soon.
                </p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <input
                      placeholder="Your Name"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                      style={ff}
                      {...register("name", { required: true })}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">Name is required</p>}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                      style={ff}
                      {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">A valid email is required</p>}
                  </div>
                  <div>
                    <textarea
                      placeholder="Your message..."
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25 resize-none"
                      style={ff}
                      {...register("message", { required: true })}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">Message is required</p>}
                  </div>
                  {status === "error" && <p className="text-xs text-red-500">Something went wrong, please try again.</p>}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-3 bg-[#0c3f35] text-white rounded-xl font-semibold hover:bg-[#0c3f35]/88 active:scale-[0.98] transition-all disabled:opacity-60"
                    style={ff}
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
