import { Exercise } from '../../types';

type DefaultExerciseMedia = Pick<Exercise, 'imageUrl' | 'videoUrl' | 'videoEmbedUrl'>;

export const DEFAULT_EXERCISE_MEDIA: Record<string, DefaultExerciseMedia> = {
  'ex_pushup_standard': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBvlsYgSuRKKwM2VH56BIPR4OrELKVz7s09S0iMGEKQGewA2aoHJuI8GCZRuCAKHpvsrQfD7Kzl5GYq2GrT72Ya5_38N0dHqxH9SJg2cNHfzVXzo5jZNxPpsOpUINNREoVKqKI5p7-YE/s16000/peito-ombros-calistenia-iniciante-intermediario.png",
  },
  'ex_knee_pushup': {
    videoUrl: "https://www.youtube.com/watch?v=PDr5B2jLUOw",
  },
  'ex_bench_dips': {
    videoUrl: "https://www.youtube.com/watch?v=WVeZDBhZwLA",
  },
  'ex_decline_pushup_adv_hold': {
    videoUrl: "https://www.youtube.com/watch?v=xloazKLlfnw",
  },
  'ex_dips_adv_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTlYGNIvJZkvfh03eK-MJ4jYAwq8RR0H0dq_QPi19NEvBu2vyarMDcivjXIy1RlUrrnX7yuNfMTcXNdpxbAsiGmxuCjfL-GN1nD0Npdje4dnlV_jASTrzT9Icd_RuaL1AY6VzaxFesqvA/s640/treino-flexao-calistenia-iniciante.png",
  },
  'ex_pike_hold': {
    videoUrl: "https://www.youtube.com/watch?v=o136fgEI6T4",
  },
  'ex_incline_pushup': {
    videoUrl: "https://www.youtube.com/watch?v=Gvm5Q29UHbk",
  },
  'ex_pushup_hold': {
    videoUrl: "https://www.youtube.com/watch?v=mmTAFhFpdY8",
  },
  'ex_decline_pushup_hold': {
    videoUrl: "https://www.youtube.com/watch?v=xloazKLlfnw",
  },
  'ex_dips_hold': {
    videoUrl: "https://www.youtube.com/watch?v=K3YE-tG6kPo",
  },
  'ex_parallel_dips': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBvlsYgSuRKKwM2VH56BIPR4OrELKVz7s09S0iMGEKQGewA2aoHJuI8GCZRuCAKHpvsrQfD7Kzl5GYq2GrT72Ya5_38N0dHqxH9SJg2cNHfzVXzo5jZNxPpsOpUINNREoVKqKI5p7-YE/s16000/peito-ombros-calistenia-iniciante-intermediario.png",
  },
  'ex_diamond_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOxSnJ0DzwcOBCKTzjj4aHAsF1kRvasz1kanIc00TsEIRT3UoNUDN6ygIR8UHPyXkwII3FX7Jg-S0Qm5_oREi-6LA5CMx8MxznluHcpdZ96QiWEezt7QkSDgne0UQo3tGj1vLPcNoDmaY/s16000/biceps-triceps-calistenia-iniciante-intermediario.png",
  },
  'ex_pike_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBvlsYgSuRKKwM2VH56BIPR4OrELKVz7s09S0iMGEKQGewA2aoHJuI8GCZRuCAKHpvsrQfD7Kzl5GYq2GrT72Ya5_38N0dHqxH9SJg2cNHfzVXzo5jZNxPpsOpUINNREoVKqKI5p7-YE/s16000/peito-ombros-calistenia-iniciante-intermediario.png",
  },
  'ex_typewriter_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBvlsYgSuRKKwM2VH56BIPR4OrELKVz7s09S0iMGEKQGewA2aoHJuI8GCZRuCAKHpvsrQfD7Kzl5GYq2GrT72Ya5_38N0dHqxH9SJg2cNHfzVXzo5jZNxPpsOpUINNREoVKqKI5p7-YE/s16000/peito-ombros-calistenia-iniciante-intermediario.png",
  },
  'ex_decline_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBvlsYgSuRKKwM2VH56BIPR4OrELKVz7s09S0iMGEKQGewA2aoHJuI8GCZRuCAKHpvsrQfD7Kzl5GYq2GrT72Ya5_38N0dHqxH9SJg2cNHfzVXzo5jZNxPpsOpUINNREoVKqKI5p7-YE/s16000/peito-ombros-calistenia-iniciante-intermediario.png",
  },
  'ex_wide_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUBvlsYgSuRKKwM2VH56BIPR4OrELKVz7s09S0iMGEKQGewA2aoHJuI8GCZRuCAKHpvsrQfD7Kzl5GYq2GrT72Ya5_38N0dHqxH9SJg2cNHfzVXzo5jZNxPpsOpUINNREoVKqKI5p7-YE/s16000/peito-ombros-calistenia-iniciante-intermediario.png",
  },
  'ex_wall_handstand_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY1Yu0siHewUpa0OlCDjxF7OR0XJsZlVhcghKt0QuQv_J_chOQQc46wLFbnvD8G5jE9MsvHbKzjm9w3AIetYuhi87GkiPb8zCowijw71ZqqeJUvGkSUQ9tf3B7R0OsvlqLghYlaWFkrLI/s16000/planche-handstand-peito-ombros-calistenia-intermediario.png",
  },
  'ex_planche_lean_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY1Yu0siHewUpa0OlCDjxF7OR0XJsZlVhcghKt0QuQv_J_chOQQc46wLFbnvD8G5jE9MsvHbKzjm9w3AIetYuhi87GkiPb8zCowijw71ZqqeJUvGkSUQ9tf3B7R0OsvlqLghYlaWFkrLI/s16000/planche-handstand-peito-ombros-calistenia-intermediario.png",
  },
  'ex_pseudo_planche_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY1Yu0siHewUpa0OlCDjxF7OR0XJsZlVhcghKt0QuQv_J_chOQQc46wLFbnvD8G5jE9MsvHbKzjm9w3AIetYuhi87GkiPb8zCowijw71ZqqeJUvGkSUQ9tf3B7R0OsvlqLghYlaWFkrLI/s16000/planche-handstand-peito-ombros-calistenia-intermediario.png",
  },
  'ex_wall_handstand_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY1Yu0siHewUpa0OlCDjxF7OR0XJsZlVhcghKt0QuQv_J_chOQQc46wLFbnvD8G5jE9MsvHbKzjm9w3AIetYuhi87GkiPb8zCowijw71ZqqeJUvGkSUQ9tf3B7R0OsvlqLghYlaWFkrLI/s16000/planche-handstand-peito-ombros-calistenia-intermediario.png",
  },
  'ex_deep_wide_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgY1Yu0siHewUpa0OlCDjxF7OR0XJsZlVhcghKt0QuQv_J_chOQQc46wLFbnvD8G5jE9MsvHbKzjm9w3AIetYuhi87GkiPb8zCowijw71ZqqeJUvGkSUQ9tf3B7R0OsvlqLghYlaWFkrLI/s16000/planche-handstand-peito-ombros-calistenia-intermediario.png",
  },
  'ex_negative_wide_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDazAPrabsBHLuRg0StUAwjxd3MqElcJdtgLRsOPCGgNnvotTx4zf5usKNpIS63jtKZkrkHnJVCxvgrAkQMhBEQr6w7DKp_Z1BWa46aA6sarFjcPo15NfBVCfrVNgDlfcSUCqgB__VjKg/s16000/treino-costas-calistenia-iniciante-intermediario.png",
  },
  'ex_wide_australian_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDazAPrabsBHLuRg0StUAwjxd3MqElcJdtgLRsOPCGgNnvotTx4zf5usKNpIS63jtKZkrkHnJVCxvgrAkQMhBEQr6w7DKp_Z1BWa46aA6sarFjcPo15NfBVCfrVNgDlfcSUCqgB__VjKg/s16000/treino-costas-calistenia-iniciante-intermediario.png",
  },
  'ex_lower_back_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDazAPrabsBHLuRg0StUAwjxd3MqElcJdtgLRsOPCGgNnvotTx4zf5usKNpIS63jtKZkrkHnJVCxvgrAkQMhBEQr6w7DKp_Z1BWa46aA6sarFjcPo15NfBVCfrVNgDlfcSUCqgB__VjKg/s16000/treino-costas-calistenia-iniciante-intermediario.png",
  },
  'ex_superman_crunches': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDazAPrabsBHLuRg0StUAwjxd3MqElcJdtgLRsOPCGgNnvotTx4zf5usKNpIS63jtKZkrkHnJVCxvgrAkQMhBEQr6w7DKp_Z1BWa46aA6sarFjcPo15NfBVCfrVNgDlfcSUCqgB__VjKg/s16000/treino-costas-calistenia-iniciante-intermediario.png",
  },
  'ex_neutral_grip_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOxSnJ0DzwcOBCKTzjj4aHAsF1kRvasz1kanIc00TsEIRT3UoNUDN6ygIR8UHPyXkwII3FX7Jg-S0Qm5_oREi-6LA5CMx8MxznluHcpdZ96QiWEezt7QkSDgne0UQo3tGj1vLPcNoDmaY/s16000/biceps-triceps-calistenia-iniciante-intermediario.png",
  },
  'ex_wide_chinup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOxSnJ0DzwcOBCKTzjj4aHAsF1kRvasz1kanIc00TsEIRT3UoNUDN6ygIR8UHPyXkwII3FX7Jg-S0Qm5_oREi-6LA5CMx8MxznluHcpdZ96QiWEezt7QkSDgne0UQo3tGj1vLPcNoDmaY/s16000/biceps-triceps-calistenia-iniciante-intermediario.png",
  },
  'ex_negative_sphinx_pushup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOxSnJ0DzwcOBCKTzjj4aHAsF1kRvasz1kanIc00TsEIRT3UoNUDN6ygIR8UHPyXkwII3FX7Jg-S0Qm5_oREi-6LA5CMx8MxznluHcpdZ96QiWEezt7QkSDgne0UQo3tGj1vLPcNoDmaY/s16000/biceps-triceps-calistenia-iniciante-intermediario.png",
  },
  'ex_chinup_standard': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRT8K5jApJO1dvQRFyAGRBbfsJDhKxSBUAhyphenhyphenQg09gxeujak5V5mJDo8jLZcxNNHOB90vcHr_c4C2Lo5441O-Q0vMGFfRVxeOB1TaIa0eby7YiUEr98DskW16KpqHBWC-J6Jkdb9RHG1kI/s16000/treino-barra-calistenia-iniciante.png",
  },
  'ex_chinup_adv_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRT8K5jApJO1dvQRFyAGRBbfsJDhKxSBUAhyphenhyphenQg09gxeujak5V5mJDo8jLZcxNNHOB90vcHr_c4C2Lo5441O-Q0vMGFfRVxeOB1TaIa0eby7YiUEr98DskW16KpqHBWC-J6Jkdb9RHG1kI/s16000/treino-barra-calistenia-iniciante.png",
  },
  'ex_pullup_adv_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRT8K5jApJO1dvQRFyAGRBbfsJDhKxSBUAhyphenhyphenQg09gxeujak5V5mJDo8jLZcxNNHOB90vcHr_c4C2Lo5441O-Q0vMGFfRVxeOB1TaIa0eby7YiUEr98DskW16KpqHBWC-J6Jkdb9RHG1kI/s16000/treino-barra-calistenia-iniciante.png",
  },
  'ex_negative_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRT8K5jApJO1dvQRFyAGRBbfsJDhKxSBUAhyphenhyphenQg09gxeujak5V5mJDo8jLZcxNNHOB90vcHr_c4C2Lo5441O-Q0vMGFfRVxeOB1TaIa0eby7YiUEr98DskW16KpqHBWC-J6Jkdb9RHG1kI/s16000/treino-barra-calistenia-iniciante.png",
  },
  'ex_australian_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDazAPrabsBHLuRg0StUAwjxd3MqElcJdtgLRsOPCGgNnvotTx4zf5usKNpIS63jtKZkrkHnJVCxvgrAkQMhBEQr6w7DKp_Z1BWa46aA6sarFjcPo15NfBVCfrVNgDlfcSUCqgB__VjKg/s16000/treino-costas-calistenia-iniciante-intermediario.png",
  },
  'ex_incline_chinup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRT8K5jApJO1dvQRFyAGRBbfsJDhKxSBUAhyphenhyphenQg09gxeujak5V5mJDo8jLZcxNNHOB90vcHr_c4C2Lo5441O-Q0vMGFfRVxeOB1TaIa0eby7YiUEr98DskW16KpqHBWC-J6Jkdb9RHG1kI/s16000/treino-barra-calistenia-iniciante.png",
  },
  'ex_scapula_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_pullup_standard': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDazAPrabsBHLuRg0StUAwjxd3MqElcJdtgLRsOPCGgNnvotTx4zf5usKNpIS63jtKZkrkHnJVCxvgrAkQMhBEQr6w7DKp_Z1BWa46aA6sarFjcPo15NfBVCfrVNgDlfcSUCqgB__VjKg/s16000/treino-costas-calistenia-iniciante-intermediario.png",
  },
  'ex_tuck_front_lever_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_tuck_front_lever_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_dragon_flag_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_wide_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_traps_shrugs': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_wide_face_pullup': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_reverse_leg_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdRAfWxld_NPXW6ATE-D6TizWxRU7dOl3hhykT1M-LsNf4ysDyQQfENDcRfVmwtjDWERE6Kn5UKxHu5mI3hRVsIxlrmyvzYyuzCSwsvYhk9WidJyPwz2oS0CC-xVYix7iaJQ3FOipj8fA/s16000/front-lever-costas-lombar-calistenia-intermediario.png",
  },
  'ex_lunges': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQplG_N5C1PrsDZV-lX6MSIn4IN0nzjMXD-qiXuyxsodETQofNdwNFVJbZrgdJEwrng96P12GjRDQrC2GDPfit90XcgmwaSLbA-UH8JGk_AhHOuMLKv3cCLj25nY2ZQfizscdrjmfeCgw/s16000/treino-pernas-abs-calistenia-iniciante-intermediario.png",
  },
  'ex_sumo_squat': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQplG_N5C1PrsDZV-lX6MSIn4IN0nzjMXD-qiXuyxsodETQofNdwNFVJbZrgdJEwrng96P12GjRDQrC2GDPfit90XcgmwaSLbA-UH8JGk_AhHOuMLKv3cCLj25nY2ZQfizscdrjmfeCgw/s16000/treino-pernas-abs-calistenia-iniciante-intermediario.png",
  },
  'ex_one_leg_hamstring_levers': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQplG_N5C1PrsDZV-lX6MSIn4IN0nzjMXD-qiXuyxsodETQofNdwNFVJbZrgdJEwrng96P12GjRDQrC2GDPfit90XcgmwaSLbA-UH8JGk_AhHOuMLKv3cCLj25nY2ZQfizscdrjmfeCgw/s16000/treino-pernas-abs-calistenia-iniciante-intermediario.png",
  },
  'ex_90deg_leg_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQplG_N5C1PrsDZV-lX6MSIn4IN0nzjMXD-qiXuyxsodETQofNdwNFVJbZrgdJEwrng96P12GjRDQrC2GDPfit90XcgmwaSLbA-UH8JGk_AhHOuMLKv3cCLj25nY2ZQfizscdrjmfeCgw/s16000/treino-pernas-abs-calistenia-iniciante-intermediario.png",
  },
  'ex_oblique_knee_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQplG_N5C1PrsDZV-lX6MSIn4IN0nzjMXD-qiXuyxsodETQofNdwNFVJbZrgdJEwrng96P12GjRDQrC2GDPfit90XcgmwaSLbA-UH8JGk_AhHOuMLKv3cCLj25nY2ZQfizscdrjmfeCgw/s16000/treino-pernas-abs-calistenia-iniciante-intermediario.png",
  },
  'ex_hanging_human_flag': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiR00vKfNuU774MLJXthIdBmQBX_qQ2yvA-Mlb2MZaUVfgHg2Ucl4yvi8IZo5c6OF2YjM7h73FGf_BmVZL3wKtfJ1ZlAYHfSPAIDLeDQMIq7LEp3pSCkiY2ohAle0quAw1ob-BkhYQbcpw/s16000/pistol-squat-bandeira-humana-pernas-core-calistenia-intermediario.png",
  },
  'ex_windshield_wipers': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiR00vKfNuU774MLJXthIdBmQBX_qQ2yvA-Mlb2MZaUVfgHg2Ucl4yvi8IZo5c6OF2YjM7h73FGf_BmVZL3wKtfJ1ZlAYHfSPAIDLeDQMIq7LEp3pSCkiY2ohAle0quAw1ob-BkhYQbcpw/s16000/pistol-squat-bandeira-humana-pernas-core-calistenia-intermediario.png",
  },
  'ex_assisted_pistol_squat': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiR00vKfNuU774MLJXthIdBmQBX_qQ2yvA-Mlb2MZaUVfgHg2Ucl4yvi8IZo5c6OF2YjM7h73FGf_BmVZL3wKtfJ1ZlAYHfSPAIDLeDQMIq7LEp3pSCkiY2ohAle0quAw1ob-BkhYQbcpw/s16000/pistol-squat-bandeira-humana-pernas-core-calistenia-intermediario.png",
  },
  'ex_bulgarian_squat': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiR00vKfNuU774MLJXthIdBmQBX_qQ2yvA-Mlb2MZaUVfgHg2Ucl4yvi8IZo5c6OF2YjM7h73FGf_BmVZL3wKtfJ1ZlAYHfSPAIDLeDQMIq7LEp3pSCkiY2ohAle0quAw1ob-BkhYQbcpw/s16000/pistol-squat-bandeira-humana-pernas-core-calistenia-intermediario.png",
  },
  'ex_one_leg_calf_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiR00vKfNuU774MLJXthIdBmQBX_qQ2yvA-Mlb2MZaUVfgHg2Ucl4yvi8IZo5c6OF2YjM7h73FGf_BmVZL3wKtfJ1ZlAYHfSPAIDLeDQMIq7LEp3pSCkiY2ohAle0quAw1ob-BkhYQbcpw/s16000/pistol-squat-bandeira-humana-pernas-core-calistenia-intermediario.png",
  },
  'ex_full_leg_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiR00vKfNuU774MLJXthIdBmQBX_qQ2yvA-Mlb2MZaUVfgHg2Ucl4yvi8IZo5c6OF2YjM7h73FGf_BmVZL3wKtfJ1ZlAYHfSPAIDLeDQMIq7LEp3pSCkiY2ohAle0quAw1ob-BkhYQbcpw/s16000/pistol-squat-bandeira-humana-pernas-core-calistenia-intermediario.png",
  },
  'ex_squat': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvonmZhBqUB_zW9LfVeWNEkOznjdbbY72-iVrtsCL1gBdkemuuERkm2lnPyU2Nt6nqfq7wjZV7uv62QuZM7HOTnDzafGRwnNWPtPX8uUYfTrabBnBQ0a2VW8-cKk-gLAWtJh91Xt8lyYE/s16000/treino-abs-core-pernas-calistenia-iniciante.png",
  },
  'ex_hamstring_levers': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvonmZhBqUB_zW9LfVeWNEkOznjdbbY72-iVrtsCL1gBdkemuuERkm2lnPyU2Nt6nqfq7wjZV7uv62QuZM7HOTnDzafGRwnNWPtPX8uUYfTrabBnBQ0a2VW8-cKk-gLAWtJh91Xt8lyYE/s16000/treino-abs-core-pernas-calistenia-iniciante.png",
  },
  'ex_calf_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvonmZhBqUB_zW9LfVeWNEkOznjdbbY72-iVrtsCL1gBdkemuuERkm2lnPyU2Nt6nqfq7wjZV7uv62QuZM7HOTnDzafGRwnNWPtPX8uUYfTrabBnBQ0a2VW8-cKk-gLAWtJh91Xt8lyYE/s16000/treino-abs-core-pernas-calistenia-iniciante.png",
  },
  'ex_hanging_knee_raises': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvonmZhBqUB_zW9LfVeWNEkOznjdbbY72-iVrtsCL1gBdkemuuERkm2lnPyU2Nt6nqfq7wjZV7uv62QuZM7HOTnDzafGRwnNWPtPX8uUYfTrabBnBQ0a2VW8-cKk-gLAWtJh91Xt8lyYE/s16000/treino-abs-core-pernas-calistenia-iniciante.png",
  },
  'ex_legs_hold': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvonmZhBqUB_zW9LfVeWNEkOznjdbbY72-iVrtsCL1gBdkemuuERkm2lnPyU2Nt6nqfq7wjZV7uv62QuZM7HOTnDzafGRwnNWPtPX8uUYfTrabBnBQ0a2VW8-cKk-gLAWtJh91Xt8lyYE/s16000/treino-abs-core-pernas-calistenia-iniciante.png",
  },
  'ex_short_bridge': {
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvonmZhBqUB_zW9LfVeWNEkOznjdbbY72-iVrtsCL1gBdkemuuERkm2lnPyU2Nt6nqfq7wjZV7uv62QuZM7HOTnDzafGRwnNWPtPX8uUYfTrabBnBQ0a2VW8-cKk-gLAWtJh91Xt8lyYE/s16000/treino-abs-core-pernas-calistenia-iniciante.png",
  },
};
