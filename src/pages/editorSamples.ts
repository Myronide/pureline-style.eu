/** Example code for languages that are highlighted but not checked. Taken from the style profiles. */
export const extraSamples: Record<string, string> = {
  rust: `use std::fs;

fn load_config(path: &Path) -> Result<Config, ConfigError> {
    let content = fs::read_to_string(path)?;
    let config = toml::from_str(&content)?;
    Ok(config)
}
`,
  go: `package session

func openSession(request Request) (Session, error) {
	if !request.IsValid() {
		return Session{}, ErrInvalidRequest
	}

	user, ok := request.User()
	if !ok {
		return Session{}, ErrMissingUser
	}

	return Open(user), nil
}
`,
  python: `def open_session(request: Request) -> Session:
    if not request.is_valid():
        raise InvalidRequestError(request)

    user = request.user
    if user is None:
        raise MissingUserError()

    return Session.open(user)
`,
  crystal: `def charge(user : User?, amount : Int32) : Receipt
  raise InactiveUserError.new unless user.try &.active
  raise InvalidAmountError.new(amount) if amount <= 0

  pay(user, amount)
end
`,
  emvus: `method<Int> square(Int value) {
    return value * value;
}

method<T> first(List<T> items) where T {
    return items.get(0);
}
`,
  emerald: `namespace App::Session;

use App::Model::Session;

public class SessionService {
    public Int square(Int value) {
        return value * value;
    }
}
`,
  novus: `package main

method main {
    var names = ["Ada", "Grace"]
    for (n in names) {
        println "Hello, \${n}!"
    }
}
`,
  qml: `import QtQuick

Rectangle {
    id: root

    required property string title
    required property bool active
    color: active ? "#22d3ee" : "#8d8da6"

    Text {
        anchors.centerIn: parent
        text: root.title
    }
}
`,
  astro: `---
interface Props {
  title: string;
  draft?: boolean;
}

const { title, draft = false } = Astro.props;
if (draft) {
  return Astro.redirect("/drafts");
}
---
<h2>{title}</h2>
`,
  html: `<!doctype html>
<html lang="en">
  <head>
    <title>Session</title>
  </head>
  <body>
    <nav aria-label="Primary">
      <a href="/docs">Docs</a>
    </nav>
  </body>
</html>
`,
  css: `:root {
  --color-accent: #22d3ee;
  --space-3: 0.75rem;
}

.badge {
  color: var(--color-accent);
  padding: var(--space-3);
}
`,
};
