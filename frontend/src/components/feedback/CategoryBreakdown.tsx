import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryRow } from "./CategoryRow";
import type { CategoryFeedback } from "@/types/feedback.type";

interface CategoryBreakdownProps {
  categories: CategoryFeedback[];
  defaultExpandedId?: string;
}

export function CategoryBreakdown({
  categories,
  defaultExpandedId,
}: CategoryBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    defaultExpandedId ?? null,
  );

  console.log(categories);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {categories.map((category) => (
          <CategoryRow
            key={category.name}
            category={category}
            expanded={expandedId === category.name}
            onToggle={() =>
              setExpandedId((cur) =>
                cur === category.name ? null : category.name,
              )
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
