"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info, ArrowRight, Users, Clock, Target } from "lucide-react"

export default function KanbanInfo() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">What is a Kanban Board?</h3>
            <p className="text-sm text-blue-700">Learn how to organize your work effectively</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 transition-colors"
          >
            {isExpanded ? "Less" : "More"}
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-blue-600 hover:text-blue-800 transition-colors ml-2"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-blue-200 bg-white">
          <div className="pt-4 space-y-6">
            {/* What is Kanban */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What is Kanban?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kanban is a visual project management method that helps teams visualize work, limit work-in-progress,
                and maximize efficiency. It uses boards with columns and cards to represent different stages of work.
                kanban.joemilburn is a live, interactive workboard that allows you to see work updates from colleagues on
                the same board as they happen.
              </p>
            </div>

            {/* How it works */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">How it works:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 text-sm">Columns</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Represent different stages like "To Do", "In Progress", "Done"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 text-sm">Cards</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Individual tasks that move through columns as work progresses
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 text-sm">Flow</h5>
                    <p className="text-xs text-gray-600 mt-1">Visual workflow that shows bottlenecks and progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Key Benefits:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Visualize your entire workflow
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Identify bottlenecks quickly
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Improve team collaboration
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Increase productivity and focus
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Getting Started
              </h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Create a new board for your project</li>
                <li>2. Add columns like "To Do", "In Progress", "Review", "Done"</li>
                <li>3. Create cards for each task or item</li>
                <li>4. Move cards between columns as work progresses</li>
                <li>5. Collaborate with your team in real-time</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
