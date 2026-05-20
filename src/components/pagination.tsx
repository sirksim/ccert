type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
};

const getVisiblePages = (page: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);

  return Array.from(pages)
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((a, b) => a - b);
};

export default function Pagination({
  basePath,
  page,
  totalPages,
  totalItems,
  perPage,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="pagination-summary">
        Showing {totalItems} of {totalItems}
      </div>
    );
  }

  const firstItem = (page - 1) * perPage + 1;
  const lastItem = Math.min(page * perPage, totalItems);
  const pages = getVisiblePages(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <p>
        Showing {firstItem}–{lastItem} of {totalItems}
      </p>

      <div className="pagination-links">
        <a
          className={`pagination-link ${page === 1 ? "is-disabled" : ""}`}
          href={`${basePath}?page=${Math.max(1, page - 1)}`}
          aria-disabled={page === 1 ? "true" : "false"}
        >
          Previous
        </a>

        {pages.map((pageNumber, index) => (
          <>
            {index > 0 && pageNumber - (pages[index - 1] ?? pageNumber) > 1 && (
              <span className="pagination-ellipsis">…</span>
            )}
            <a
              className={`pagination-link ${pageNumber === page ? "is-active" : ""}`}
              href={`${basePath}?page=${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </a>
          </>
        ))}

        <a
          className={`pagination-link ${page === totalPages ? "is-disabled" : ""}`}
          href={`${basePath}?page=${Math.min(totalPages, page + 1)}`}
          aria-disabled={page === totalPages ? "true" : "false"}
        >
          Next
        </a>
      </div>
    </nav>
  );
}
