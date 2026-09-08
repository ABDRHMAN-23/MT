import { ArrowLeft } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Ornament, PlateGlyph } from '../components/ui/Bits';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="grid h-28 w-28 place-items-center rounded-full bg-ivory text-gold">
        <PlateGlyph size={58} />
      </div>
      <p className="headline mt-8 text-5xl text-cocoa">٤٠٤</p>
      <h1 className="headline mt-3 text-2xl text-cocoa">الطبق فارغ</h1>
      <Ornament className="mt-5" />
      <p className="mt-5 text-[14px] leading-loose text-mocha">
        يبدو أن هذه الصفحة ذابت قبل أن تصل إليها. لكن لدينا ما هو ألذّ في المجموعة.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/" size="lg">
          الصفحة الرئيسية
        </ButtonLink>
        <ButtonLink to="/shop" variant="secondary" size="lg">
          تصفّح الحلويات
          <ArrowLeft size={17} />
        </ButtonLink>
      </div>
    </section>
  );
}
