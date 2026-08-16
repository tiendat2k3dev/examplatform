"use client";

interface HeaderQuestionsProps {
  title: string;
  description: string;
  add: string;
  onAdd: () => void;
}

const HeaderCategories = ({
  title,
  description,
  add,
  onAdd,
}: HeaderQuestionsProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold mb-1">{title}</h2>

        <p className="text-secondary mb-0">{description}</p>
      </div>

      <button type="button" className="btn btn-primary" onClick={onAdd}>
        <i className="bi bi-plus-lg me-2"></i>
        {add}
      </button>
    </div>
  );
};

export default HeaderCategories;
