
export default function Brand() {
  return (
    <div className='flex items-center gap-3'>
      <div className='size-10 rounded-xl grid place-items-center bg-gradient-to-br from-accent to-accent-2'>
        <span className='text-xl'>🧠</span>
      </div>
      <div className='leading-tight'>
        <p className='text-lg font-medium'>
          Daily Start for my
          <span className='relative font-semibold text-pink-500' style={{marginLeft: 4}}>
             special person
            <span className='absolute inset-0 blur-md bg-pink-500 opacity-50 -z-10'></span>
          </span>
        </p>

        <div className='text-xs text-muted'>
          One smile a day keeps the stress away.
        </div>
      </div>
    </div>
  );
}
