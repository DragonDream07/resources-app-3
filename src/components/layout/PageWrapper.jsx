function PageWrapper({ children, className = '' }) {
  return (
    <div
      className={[
        'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default PageWrapper;
