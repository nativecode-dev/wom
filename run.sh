DEBUG="wom:*" deno run \
  --allow-env \
  --allow-net \
  --allow-read \
  --allow-write \
  --config tsconfig.json \
  --importmap importmap.json \
  --unstable \
  mod.ts $@ \
  ;
