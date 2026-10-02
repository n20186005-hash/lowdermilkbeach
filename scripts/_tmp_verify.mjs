import fs from 'node:fs';

const files = [
  '.next/server/app/en/parking.html',
  '.next/server/app/en/hours.html',
  '.next/server/app/zh/parking.html',
];

function grab(html, re) {
  const m = html.match(re);
  return m ? m[1].slice(0, 100) : '(missing)';
}

for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  console.log('=== ' + f);
  console.log('title      :', grab(h, /<title>([^<]*)<\/title>/));
  console.log('canonical  :', grab(h, /rel="canonical" href="([^"]*)"/));
  console.log('hreflang en:', grab(h, /hreflang="en" href="([^"]*)"/));
  console.log('hreflang zh:', grab(h, /hreflang="zh" href="([^"]*)"/));
  console.log('x-default  :', grab(h, /hreflang="x-default" href="([^"]*)"/));
  console.log('robots     :', grab(h, /name="robots" content="([^"]*)"/));
  console.log('H1 ok      :', /Lowdermilk Beach &amp; Lowdermilk Park Parking Guide|Lowdermilk Park Hours/.test(h));
  console.log('Breadcrumb :', /BreadcrumbList/.test(h));
  console.log('FAQPage    :', /FAQPage/.test(h));
}
