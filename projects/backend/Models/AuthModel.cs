public class StartAuthRequest
{
  public string ClientPublicEphemeral { get; set; } = null!;
}

public class CompleteAuthRequest
{
  public string ClientProof { get; set; } = null!;
}
