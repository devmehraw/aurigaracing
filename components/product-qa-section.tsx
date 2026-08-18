"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface ProductQASectionProps {
  productId: string
}

export function ProductQASection({ productId }: ProductQASectionProps) {
  const [questions, setQuestions] = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [productId])

  async function fetchQuestions() {
    const supabase = createClient()
    const { data } = await supabase
      .from("product_questions")
      .select(`
        *,
        product_answers (*)
      `)
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(10)

    if (data) setQuestions(data)
  }

  async function askQuestion() {
    if (!newQuestion.trim()) return

    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Please login to ask questions")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("product_questions").insert({
      product_id: productId,
      user_id: user.id,
      question: newQuestion,
    })

    if (!error) {
      toast.success("Question submitted!")
      setNewQuestion("")
      fetchQuestions()
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Ask a Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Have a question about this product?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            rows={3}
          />
          <Button onClick={askQuestion} disabled={loading}>
            Submit Question
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Questions & Answers</h3>
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No questions yet. Be the first to ask!</p>
        ) : (
          questions.map((q) => (
            <Card key={q.id}>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <p className="font-medium">Q: {q.question}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(q.created_at), "MMM dd, yyyy")}</p>
                </div>
                {q.product_answers && q.product_answers.length > 0 && (
                  <div className="pl-4 border-l-2 border-[#bd9131] space-y-2">
                    {q.product_answers.map((answer: any) => (
                      <div key={answer.id}>
                        <p className="text-sm">
                          <span className="font-medium">A:</span> {answer.answer}
                        </p>
                        {answer.is_staff && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Official Answer
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
