// Stable product code samples used across the site.
// These are real CodeFirstGames builder-API snippets (source of truth: the product README/specs).
// Kept as raw strings so a build-time highlighter (shiki) can theme them consistently.

/** Hero centerpiece: a whole scene authored as one flat, readable C# file. */
export const heroScene = `public class MainMenu : ISceneDefinition
{
    public void Build(SceneRoot scene)
    {
        var player = scene.Add("Player").Transform(pos: (0, 1, 0));
        player.Component<Rigidbody>(rb => rb.Set(r => r.mass, 5f));

        var door = scene.Add("Door").Transform(pos: (4, 0, 0));
        scene.Add("OpenButton")
             .Component<Button>(b => b.OnClick(door, nameof(Door.Open)));
    }
}`;

/**
 * The two-way sync moment: drag "Player" in the editor, and the file rewrites
 * itself. Rendered as a diff (— old line, + new line).
 */
export const syncDiff = `player.Transform(pos: (0, 1, 0));     // [!code --]
player.Transform(pos: (2.5f, 1, -3)); // [!code ++]`;

/** Minimal "hello scene" for the origin / how-it-works beat. */
export const helloScene = `public class MainMenu : ISceneDefinition
{
    public void Build(SceneRoot scene) =>
        scene.Add("Hello").Transform(pos: (0, 1, 0));
}`;
