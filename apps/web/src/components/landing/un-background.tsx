'use client'

import { useScroll, useTransform, motion } from 'framer-motion'

export function UnBackground() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -400])

  return (
    <div className="fixed inset-0 z-0 flex items-start justify-center overflow-hidden pointer-events-none">
      <motion.div
        style={{ y }}
        className="mt-20 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-[600px] w-[600px] opacity-[0.15] blur-[6px] dark:opacity-[0.08]">
          <svg viewBox="0 0 512 512" className="h-full w-full text-accent" fill="none">
            <g stroke="currentColor" strokeWidth="1.2">
              <circle cx="256" cy="256" r="150" strokeWidth="1.8" />
              <ellipse cx="256" cy="256" rx="150" ry="120" strokeWidth="0.6" />
              <ellipse cx="256" cy="256" rx="150" ry="75" strokeWidth="0.6" />
              <line x1="106" y1="256" x2="406" y2="256" strokeWidth="0.6" />
              <ellipse cx="256" cy="256" rx="50" ry="150" strokeWidth="0.6" />
              <ellipse cx="256" cy="256" rx="100" ry="150" strokeWidth="0.6" />
              <line x1="256" y1="106" x2="256" y2="406" strokeWidth="0.6" />
              <path d="M 160 140 Q 180 120 220 130 Q 235 140 230 160 Q 225 175 210 180 Q 195 185 185 175 Q 170 160 160 140Z" strokeWidth="0.8" />
              <path d="M 180 230 Q 190 225 200 235 Q 205 255 195 280 Q 188 300 180 310 Q 175 300 173 280 Q 170 255 180 230Z" strokeWidth="0.8" />
              <path d="M 270 125 Q 285 120 300 125 Q 305 140 295 150 Q 280 155 270 150 Q 265 140 270 125Z" strokeWidth="0.8" />
              <path d="M 295 170 Q 310 160 325 165 Q 335 180 330 210 Q 325 235 315 248 Q 300 255 295 245 Q 288 225 290 195 Q 292 180 295 170Z" strokeWidth="0.8" />
              <path d="M 315 115 Q 335 105 355 110 Q 368 120 365 145 Q 360 165 345 170 Q 325 170 315 155 Q 308 140 315 115Z" strokeWidth="0.8" />
              <path d="M 150 340 Q 165 330 180 340 Q 185 355 175 365 Q 160 370 150 360 Q 145 350 150 340Z" strokeWidth="0.8" />
            </g>
            <g stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 216 405 Q 140 380 110 300 Q 90 240 110 190" />
              <path d="M 296 405 Q 372 380 402 300 Q 422 240 402 190" />
            </g>
            <g stroke="currentColor" fill="none" strokeWidth="1">
              <ellipse cx="190" cy="375" rx="14" ry="5" transform="rotate(-30 190 375)" />
              <ellipse cx="166" cy="345" rx="14" ry="5" transform="rotate(-35 166 345)" />
              <ellipse cx="146" cy="312" rx="14" ry="5" transform="rotate(-40 146 312)" />
              <ellipse cx="132" cy="278" rx="14" ry="5" transform="rotate(-50 132 278)" />
              <ellipse cx="122" cy="245" rx="14" ry="5" transform="rotate(-55 122 245)" />
              <ellipse cx="117" cy="215" rx="14" ry="5" transform="rotate(-60 117 215)" />
              <ellipse cx="322" cy="375" rx="14" ry="5" transform="rotate(30 322 375)" />
              <ellipse cx="346" cy="345" rx="14" ry="5" transform="rotate(35 346 345)" />
              <ellipse cx="366" cy="312" rx="14" ry="5" transform="rotate(40 366 312)" />
              <ellipse cx="380" cy="278" rx="14" ry="5" transform="rotate(50 380 278)" />
              <ellipse cx="390" cy="245" rx="14" ry="5" transform="rotate(55 390 245)" />
              <ellipse cx="395" cy="215" rx="14" ry="5" transform="rotate(60 395 215)" />
            </g>
          </svg>
        </div>
      </motion.div>
    </div>
  )
}
