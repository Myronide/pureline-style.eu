import type { Lang } from "./types";

export const samples: Record<Lang, string> = {
  typescript: `enum State {
  Idle = "idle",
  Ready = "ready",
}

interface IUser {
  id: string;
  active: boolean;
}

type Receipt = {
  id: string;
  total: number;
};

function process(user: IUser | null, amount: any, state: State): Receipt | undefined {
  // Check if the user exists
  if (user) {
    if (user.active) {
      if (amount > 0) {
        const tmp = pay(user, amount);
        return tmp;
      } else {
        throw new Error("invalid amount");
      }
    }
  }
}

function label(count: number): string {
  if (count === 0) return "none";
  if (count === 1) return "one";
  return count > 10 ? "many" : count > 5 ? "some" : "few";
}

const box = Block.box(
  min,
  min,
  max,
  max,
  max,
  16
);
`,

  javascript: `function charge(user, amount) {
  if (user) {
    if (user.active) {
      if (amount > 0) {
        return pay(user, amount);
      } else {
        throw new Error("invalid amount");
      }
    }
  }
}

function sync(items) {
  for (const x of items) {
    if (x.dirty) {
      if (x.valid) {
        // Save the item
        save(x);
        notify(x);
      }
    }
  }
}

function handleEverything(request) {
  if (!request) return null;

  if (request.valid) {
    execute(request);
  } else {
    reject(request);
  }
}
`,

  java: `public class Orders {
    public Result process(Request request) {
        // Check if the request is null
        if (request == null)
            return Result.empty();

        if (request != null) {
            if (request.valid()) {
                var session = sessions.create(request.user());
                return executor.execute(session, request);
            } else {
                return Result.invalid();
            }
        }

        return Result.empty();
    }

    public void drain(List<Job> jobs) {
        for (Job job : jobs) {
            if (job.ready()) {
                Job tmp = job.prepare();
                if (tmp.valid()) {
                    run(tmp);
                }
            }
        }
    }

    private Box box() {
        return Block.box(
            min,
            min,
            max,
            max,
            16
        );
    }
}
`,
  python: `def charge(user, amount):
    if user:
        if user.active:
            if amount > 0:
                return pay(user, amount)
            else:
                raise ValueError("invalid amount")
    return None
`,
  rust: `fn load(path: &Path) -> Config {
    let data = fs::read_to_string(path).unwrap();
    if path.exists() {
        if path.is_file() {
            if data.len() > 0 {
                return parse(&data);
            }
        }
    } else {
        return Config::default();
    }
    Config::default()
}
`,
};
