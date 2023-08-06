public class StartAuthRequest
{
  public string ClientEphemeralPublic { get; set; } = null!;
}

public class CompleteAuthRequest
{
  public string ClientProof { get; set; } = null!;
}
