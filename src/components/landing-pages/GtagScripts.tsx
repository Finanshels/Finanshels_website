import Script from 'next/script'

export default function GtagScripts({ conversionId }: { conversionId: string }) {
  if (!conversionId) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(conversionId)}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${conversionId}');
        `}
      </Script>
    </>
  )
}
